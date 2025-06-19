import { supabase } from "../lib/supabase";
import { uploadFile } from "./imageService";

// Accepts: { body, userId, file: [array of local media objects], id? }
export const createOrUpdatePost = async (post) => {
    try {
        const { file: files, id, ...postData } = post;
        let postDataResult;
        let postError;
        // 1. Insert or update the post
        if (id) {
            // Update existing post
            const { data, error } = await supabase
                .from("posts")
                .update({ ...postData })
                .eq("id", id)
                .select()
                .single();
            postDataResult = data;
            postError = error;
            if (!postError) {
                // Remove old media rows for this post
                await supabase.from("post_media").delete().eq("post_id", id);
            }
        } else {
            // Create new post
            const { data, error } = await supabase
                .from("posts")
                .insert({ ...postData })
                .select()
                .single();
            postDataResult = data;
            postError = error;
        }

        if (postError) {
            console.log("createOrUpdatePost error: ", postError);
            return { success: false, msg: "Could not save post" };
        }

        // 2. Upload all media in parallel
        let mediaResults = [];
        let mediaPayload = [];
        if (Array.isArray(files) && files.length > 0) {
            const uploadPromises = files.map(file => {
                const isImage = file.type === "image";
                return uploadFile(isImage ? "postImages" : "postVideos", file.uri, isImage);
            });
            const uploadResults = await Promise.all(uploadPromises);

            // Check for any failed uploads
            for (let i = 0; i < uploadResults.length; i++) {
                if (!uploadResults[i].success) {
                    // Rollback: delete the post if new, or leave as-is if update
                    if (!id) {
                        await supabase.from("posts").delete().eq("id", postDataResult.id);
                    }
                    return { success: false, msg: `Failed to upload media: ${uploadResults[i].msg}` };
                }
            }

            // Prepare media payload for bulk insert
            mediaPayload = files.map((file, i) => ({
                post_id: postDataResult.id,
                media_type: file.type === "image" ? "image" : "video",
                sort_index: i,
                uri: uploadResults[i].data,
            }));
            const { error: mediaError } = await supabase
                .from("post_media")
                .insert(mediaPayload);
            if (mediaError) {
                // Rollback: delete the post if new, or leave as-is if update
                if (!id) {
                    await supabase.from("posts").delete().eq("id", postDataResult.id);
                }
                return { success: false, msg: "Failed to save media info" };
            }
            mediaResults = mediaPayload;
        }

        return { success: true, data: { ...postDataResult, media: mediaResults || [] } };
    } catch (error) {
        console.log("createOrUpdatePost error: ", error);
        return { success: false, msg: "Could not save post" };
    }
};

export const fetchPosts = async (limit = 10, page = 1) => {
    try {
        // Calculate the range for pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        const {data, error} = await supabase
        .from("posts")
        .select(`
            *,
            user: users (id, name, image),
            media: post_media (id, media_type, sort_index, uri)
        `)
        .order('created_at', {ascending: false})
        .range(from, to);

        if (error) {
            console.log("fetchPosts error: ", error);
            return { success: false, msg: "Could not fetch posts" };
        }

        return {success: true, data: data};
        
    } catch (error) {
        console.log("fetchPosts error: ", error);
        return { success: false, msg: "Could not fetch posts" };
    }
};
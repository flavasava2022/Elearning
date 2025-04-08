import { createClient } from "@supabase/supabase-js";
import store from "../store/store";
import { userActions } from "../store/user-slice";
import sha256 from "crypto-js/sha256";
import Hex from "crypto-js/enc-hex";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const apiKey = import.meta.env.VITE_CLOUDINARY_APIKEY 
const apiSecret = import.meta.env.VITE_CLOUDINARY_APISECRET
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  multiTab: false,
});

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
};

export async function handleSignIn(userData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userData?.email,
    password: userData?.password,
  });
  if (error) {
    return { errorMsg: error.error_description || error.message };
  } else {
    if (data) {
      return;
    }
  }
}



const generateSignature = (publicId, timestamp) => {
  const params = {
    public_id: publicId,
    timestamp: timestamp,
    overwrite: "true",
    invalidate: "true",
  };

  // Sort parameters alphabetically and create the string to sign
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const stringToSign = `${sortedParams}${apiSecret}`;
  return sha256(stringToSign).toString(Hex); // Generate SHA-256 hash and convert to hex string
};
export const uploadFile = async (file, fileName) => {
  const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
  const signature = generateSignature(fileName, timestamp);

  const formData = new FormData();
  formData.append("file", file); // The file to upload
  formData.append("public_id", fileName); // Unique public_id for the file
  formData.append("overwrite", "true"); // Overwrite the existing file
  formData.append("invalidate", "true"); // Invalidate CDN cache
  formData.append("api_key", apiKey); // Your API key
  formData.append("timestamp", timestamp); // Current timestamp
  formData.append("signature", signature); // Generated signature

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dtwgx8ahj/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (data.error) {
      throw new Error(data.error.message);
    }

    const imageUrl = data.secure_url;
    return imageUrl;
  } catch (err) {
    console.error("Upload error:", err.message);
    throw err;
  }
};
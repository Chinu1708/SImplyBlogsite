// blogsApi.ts
import axios from '../api/axios';

export const deletePost = async (id: number) => {
  return await axios.delete(`/blogs/delete/${id}`);
};

import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      const { data } = await apiClient.post<{ url: string }>("/upload", formData)
      return data.url
    },
  })
}

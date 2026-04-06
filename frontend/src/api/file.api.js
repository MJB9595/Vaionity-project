import axios from "axios";
import client from './client'

export const getPresignedUrl = async({fileName, contentType})=>{
    const response = await client.post('/files/presigned-url',{
        fileName,
        contentType
    })
    return response.data
}

export const uploadFileToS3 = async({uploadUrl, file, contentType})=>{
    const response = await axios.put(uploadUrl,file,{
        headers:{
            'Content-Type':contentType
        }
    })
    return response.data
}

export const uploadImage = async(file)=>{
    // 1. 백엔드에 서명된 URL 요청
    const presigned = await getPresignedUrl({
        fileName: file.name,
        contentType: file.type
    })

    // 2. 받은 uploadUrl(대문자 U)로 S3에 파일 직접 업로드
    await uploadFileToS3({
        uploadUrl: presigned.uploadUrl, 
        file,
        contentType: file.type
    })

    // 3. 업로드가 끝나면 프론트엔드 컴포넌트가 쓸 수 있게 객체 통째로 반환
    return presigned 
}
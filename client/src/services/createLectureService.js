import axios from 'axios';

export const createLecture = async ({ sectionId, courseId, lecture_id, content, lectureTitle }) => {
    
    try {

        const api = lecture_id ? 'curriculum/lecture/update' : 'curriculum/lecture/create';
        const response = await axios.post(api, {
            lectureTitle,
            lecture_id,
            content,
            sectionId,
            courseId

        });

        return response.data;
    } catch (error) {
        console.error('Failed to create lecture:', error);
        throw error;
    }
};

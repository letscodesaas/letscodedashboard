const URL = 'https://video-service-production-5980.up.railway.app';

export const video_system_status = async () => {
  try {
    const response = await fetch(`${URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = response.status;
    return data;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const upload_video = async (body: FormData) => {
  try {
    const response = await fetch(`${URL}/upload`, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    throw new Error(String(error));
  }
};

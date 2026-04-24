const URL = process.env.NEXT_PUBLIC_EMAIL_SERVICE_DOMAIN;

export const emails = async (topic: string) => {
  try {
    const response = await fetch(`${URL}/api/v1/emails/${topic}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(String(error));
  }
};

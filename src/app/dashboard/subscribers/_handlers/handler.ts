const URL = process.env.NEXT_PUBLIC_EMAIL_SERVICE_DOMAIN;

export const system_health_check = async () => {
  try {
    const response = await fetch(`${URL}`, {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const upload_topic_subscriber = async (formdata) => {
  try {
    const response = await fetch(`${URL}/api/v1/upload-csv`, {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
      redirect: 'follow',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const topics = async () => {
  try {
    const response = await fetch(`${URL}/api/v1/topics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const send_Bulk_mail = async (datas) => {
  try {
    // topic, html, category, subject
    const response = await fetch(`${URL}/api/v1/bulkmail`, {
      method: 'POST',
      body: JSON.stringify(datas),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const generate_ai_email_template = async (template: string) => {
  try {
    const response = await fetch('/api/contentgeneration', {
      method: 'POST',
      body: JSON.stringify({ topic: template }),
    });
    const data = await response.json();
    return data.message;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const notificatonEvent = async()=>{
   try {
    const response = await fetch(`${URL}/api/v1/scheduled`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(String(error));
  } 
}
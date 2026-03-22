exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const input = body.input;

    if (!input) {
      return {
        statusCode: 200,
        body: JSON.stringify({ error: "No input provided" })
      };
    }

    const fetch = (...args) =>
      import("node-fetch").then(({ default: fetch }) => fetch(...args));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Write 2 short resume bullet points using action verbs."
          },
          {
            role: "user",
            content: input
          }
        ],
        max_tokens: 80
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        output: data.choices?.[0]?.message?.content || "No response"
      })
    };

  } catch (err) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};

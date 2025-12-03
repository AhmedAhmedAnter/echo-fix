import { API_KEY } from './constants';

// Main AI Analysis Function
export const callGeminiAPI = async (title, description, base64Images) => {
  try {
    const model = "gemini-2.5-flash-preview-09-2025";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const imageParts = base64Images.map(img => ({
      inlineData: {
        mimeType: "image/jpeg",
        data: img.split(',')[1]
      }
    }));

    const prompt = `
      أنت خبير في تقييم الأدوات والأغراض المنزلية المستعملة (أثاث، أجهزة، أدوات يدوية، إلكترونيات قديمة، إلخ) واسمك "Fixer".
      الهدف: مساعدة المستخدم في بيع أشيائه المستعملة بسعر عادل وواقعي.
      قم بتحليل الصور المرفقة بدقة ووصف المستخدم: "${description}" والعنوان "${title}".
      المطلوب منك هو إرجاع رد بصيغة JSON فقط يحتوي على الحقول التالية باللغة العربية:
      1. "detected": اسم العنصر بدقة.
      2. "condition": تقييم صريح للحالة.
      3. "aiTitle": عنوان واضح ومباشر للبيع.
      4. "aiDescription": وصف حقيقي وأمين للمنتج يذكر المميزات والعيوب إن وجدت.
      5. "estimatedPrice": سعر عادل وواقعي جداً لسوق المستعمل في مصر (بالجنية المصري بسعر مخفض  - رقم صحيح فقط).
      6. "fixSuggestions": مصفوفة (Array) تحتوي على 3 نصائح عملية جداً لتنظيف المنتج أو إصلاحه.
      تأكد أن الرد هو JSON صالح فقط بدون أي نصوص إضافية.
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }, ...imageParts] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    if (!response.ok) throw new Error('AI Request failed');
    const data = await response.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);

  } catch (error) {
    console.error("AI Error:", error);
    return {
      detected: "أداة غير معروفة",
      condition: "مستعمل",
      aiTitle: title || "أداة مستعملة للبيع",
      aiDescription: description || "أداة مستعملة بحالة مقبولة.",
      estimatedPrice: 50,
      fixSuggestions: ["تنظيف الغبار", "التأكد من التشغيل", "تصوير واضح"]
    };
  }
};

// Chat AI Function
export const sendChatMessage = async (text, chatHistory, product) => {
  try {
    const conversationContext = chatHistory
      .map(msg => `${msg.sender === 'user' ? 'المستخدم' : 'Fixer'}: ${msg.text}`)
      .join('\n');

    const model = "gemini-2.5-flash-preview-09-2025";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const prompt = `أنت "Fixer" - خبير إصلاح الأدوات والأجهزة المنزلية المستعملة باللغة العربية.
    
معلومات المنتج:
- الاسم: ${product.originalTitle || product.title}
- الوصف: ${product.description}
${product.aiAnalysis ? `- التحليل السابق: ${product.aiAnalysis.detected}
- الحالة: ${product.aiAnalysis.condition}
- نصائح الإصلاح المقترحة:
${product.aiAnalysis.fixSuggestions.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}` : ''}

سياق المحادثة السابقة:
${conversationContext}

سؤال المستخدم الجديد: ${text}

المطلوب: قدم إجابة عملية ومفيدة ومباشرة بناءً على سؤال المستخدم. كن ودوداً ومحترفاً. اشرح بالتفصيل خطوات الإصلاح إذا طلب المستخدم ذلك. استخدم اللغة العربية الفصحى المبسطة.`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) throw new Error('AI Request failed');
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error("Chat AI Error:", error);
    throw error;
  }
};

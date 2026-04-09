/**
 * MsgOwl SMS gateway wrapper.
 * Docs: https://msgowl.com — verify exact endpoint & payload shape from your account dashboard.
 */
export async function sendOtp(phone: string, code: string): Promise<void> {
  const url = process.env.MSGOWL_API_URL
  const key = process.env.MSGOWL_API_KEY

  if (!url || !key) {
    // In development without credentials, log the OTP instead of failing
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV] OTP for ${phone}: ${code}`)
      return
    }
    throw new Error('MsgOwl credentials not configured')
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: phone,
      message: `Your Som Tam Thai verification code is: ${code}. Valid for 5 minutes. Do not share this code.`,
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`MsgOwl error ${res.status}: ${body}`)
  }
}

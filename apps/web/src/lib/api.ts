export const loginWithGoogle = () => {
   window.location.href = `http://localhost:4000/auth/google`
}

export const fetchInbox = async (email: string) => {
   const res = await fetch(`http://localhost:4000/gmail/inbox?email=${email}`)
   res.json()
}
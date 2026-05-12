'use server'

export async function signInWithEmailAndPassword(data: FormData) {
  console.info(">>DATA FORM ACTION")
  console.log(Object.fromEntries(data))
}
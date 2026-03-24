export const tokenStorage = {

  get() {
    return localStorage.getItem("accessToken")
  },

  set(token: string) {
    localStorage.setItem("accessToken", token)
  },

  clear() {
    localStorage.removeItem("accessToken")
  }

}
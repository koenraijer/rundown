export async function get({ url }) {
    let params = url.href.toString().split('?')[1]; // split creates an array of 2 strings, and we need the string at index [1]
    const code = new URLSearchParams(params).get('code')

    return {
      body: {
        code: code
      }
    }
}
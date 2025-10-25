export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const challenge = query['hub.challenge']
  
  return challenge
})

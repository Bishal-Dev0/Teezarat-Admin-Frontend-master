import { http } from './axios'

export const GET_STATIC = ({ queryKey }) => {
  const [, args] = queryKey
  return http({
    method: 'GET',
    url: '/global/get',
    params: args,
  })
}

export const CREATE_STATIC = (values) => {
  return http.put('/global/edit', values)
}

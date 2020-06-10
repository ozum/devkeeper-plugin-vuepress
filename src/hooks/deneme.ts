import {promises} from 'fs'
const {readdir} = promises

export default async function (options: {channel: string}) {
  console.log('FROM HOOK: ', options.channel)
}

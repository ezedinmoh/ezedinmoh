import https from 'https'

const ids = [
  '7690214314351037717',
  '7682790473752186133',
  '7670064348332576021',
  '7690919403667377460',
  '7683112730294865173',
  '7677198929301196052',
  '7671611191864675605',
  '7668291336642645269',
]

async function fetchOne(id) {
  return new Promise((resolve) => {
    const req = https.get('https://www.tikwm.com/api/?url=https://www.tiktok.com/@ezedinmoh/video/' + id, (res) => {
      let data = ''
      res.on('data', (c) => (data += c))
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve({
            id,
            ok: json.code === 0,
            title: json.data?.title,
            views: json.data?.play_count,
            likes: json.data?.digg_count,
            comments: json.data?.comment_count,
            shares: json.data?.share_count,
            cover: json.data?.cover || json.data?.origin_cover,
            duration: json.data?.duration,
            author: json.data?.author?.unique_id,
          })
        } catch (e) {
          resolve({ id, ok: false, error: e.message })
        }
      })
    })
    req.on('error', (err) => resolve({ id, ok: false, error: err.message }))
  })
}

async function main() {
  for (const id of ids) {
    const r = await fetchOne(id)
    console.log(JSON.stringify(r, null, 2))
    await new Promise((resolve) => setTimeout(resolve, 800))
  }
}

main()

export const DefaultCoverImage = () => {
    const palettes = [
        ['#341b52', '#4c76c6', '#f5c77c'],
        ['#6b2d11', '#d8a44e', '#efe2c8'],
        ['#681012', '#e76b2f', '#ffd66f'],
        ['#143c73', '#3f8fd4', '#d6e6fb'],
    ]
    const palette = palettes[Math.floor(Math.random() * palettes.length)]
    const svg = [
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'>",
        "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>",
        `<stop offset='0%' stop-color='${palette[0]}'/>`,
        `<stop offset='55%' stop-color='${palette[1]}'/>`,
        `<stop offset='100%' stop-color='${palette[2]}'/>`,
        '</linearGradient></defs>',
        "<rect width='160' height='160' fill='url(#g)'/>",
        "<circle cx='122' cy='36' r='18' fill='rgba(255,255,255,0.16)'/>",
        "<path d='M8 138C38 120 72 106 100 90c18-10 33-23 52-41v111H8Z' fill='rgba(15,23,42,0.28)'/>",
        "<path d='M14 148c25-19 48-29 71-37 21-7 39-19 61-42v79H14Z' fill='rgba(255,255,255,0.14)'/>",
        "<text x='18' y='136' font-size='20' font-family='Arial, sans-serif' font-weight='700' fill='white'>MOVE</text>",
        '</svg>',
    ].join('')

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}
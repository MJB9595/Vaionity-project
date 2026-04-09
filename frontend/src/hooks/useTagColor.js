const TAG_COLORS = [
  '#ffefef', // red-100
  '#fff2e0', // orange-100
  '#fcf9dd', // yellow-100
  '#f7ffe6', // lime-100
  '#d1fae5', // green-100
  '#e3fafc', // cyan-100
  '#ecf8ff', // sky-100
  '#dbeafe', // blue-100
  '#e0e7ff', // indigo-100
  '#ede9fe', // violet-100
  '#f5f3ff', // purple-50 느낌
  '#fae8ff', // fuchsia-100
  '#fdedf6', // pink-100
  '#fff1f2'  // rose-100
]

function hashString(s){
    let h =0

    for(let i=0; i<s.length;i++){
        h= (h*33)^ s.charCodeAt(i)
    }


    return Math.abs(h)

}


export function getTagColor(label){

    if(label==null || label=='') return '#e5e7eb'
    if(label==='전체') return '#e5e7eb'
    const idx = hashString(String(label))%TAG_COLORS.length

    return TAG_COLORS[idx]
}
export function getRandomColor(label){
    return getTagColor(label ?? '')
}

export function toSlug(str: string | String | null): string {
  if (!str) {
    return ''
  }

  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽạảằầấáäâàãåčçćďéěëèêẽĕȇğíìîïıìňñộốơóöòôõøðřŕšşťưúůüùûýÿžþÞĐđßÆa·/_,:;'
  const to = 'AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaaaaaaacccdeeeeeeeegiiiiiinnoooooooooorrsstuuuuuuyyzbBDdBAa------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36)
}

export function timeFuture(time: Date) {

  const VNDay = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

  function Days(day: number) {
    if (day > 6 || day < 0)
      throw Error('invalid day')

    return VNDay[day];
  }

  const between = Number(time) / 1000 - Date.now() / 1000;

  if (between < 3600) {
    return ['Hôm nay', time.getDate() + '/' + (time.getMonth() + 1)];
  }
  return [Days(time.getDay()), time.getDate() + '/' + (time.getMonth() + 1)];
}


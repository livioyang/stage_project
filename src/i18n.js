import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Cerca...': 'Search...',
      'Cerca': 'Search',
      'Film':'Movie',
      'Serie':'Tv',
      'Preferiti':'Favorites',
      'Lingua':'Languages',
      'Id':'Id',
      'Tipo':'Type',
      'Voto medio':'Vote Average',
      'Voti':'Votes',
      'Data di rilascio':'Release Date',
      'Panoramica':'OverView',
      'Elimina voto':'Delete Vote',
      'Vota Questo':'Vote This',
      'Vota':'Vote',
      'Anulla voto':'Anull Vote',
      'ERROR':'ERROR:INSERT VALID VALUE(1-10)',
      '-ELIMINA PREFERITO':'-DELETE FROM FAVORITES',
      '+AGGIUNGI PREFERITI':'+ADD TO FAVORITES',
      'il tuo voto':'Your Vote'
    },
  },
  it: {
    translation: {
      'Cerca...': 'Cerca...',
      'Cerca': 'Cerca',
      'Film': 'Film',
      'Serie':'Serie',
      'Preferiti':'Preferiti',
      'Lingua':'Lingua',
      'Id':'Id',
      'Tipo':'Tipo',
      'Voto medio':'Voto Medio',
      'Voti':'Voti',
      'Data di rilascio':'Data di rilascio',
      'Panoramica':'Panoramica',
      'Elimina voto':'Elimina Voto',
      'Vota Questo':'Vota Questo',
      'Vota':'Vota',
      'Anulla voto':'Anulla Voto',
      'ERROR':'ERRORE:INSERISCI UN VOTO VALIDO(1-10)',
      '-ELIMINA PREFERITO':'-ELIMINA PREFERITO',
      '+AGGIUNGI PREFERITI':'+AGGIUNGI PREFERITI',
      'il tuo voto':'il tuo voto'

    },
  },
  zh: {
    translation: {
      'Cerca...': '搜索中...',
      'Cerca': '搜索',
      'Film': '电影',
      'Serie':'电视剧',
      'Preferiti':'收藏',
      'Lingua':'语言',
      'Id':'编号',
      'Tipo':'类型',
      'Voto medio':'评分',
      'Voti':'评分人数',
      'Data di rilascio':'上映日期',
      'Panoramica':'介绍',
      'Elimina voto':'删除评分',
      'Vota Questo':'评价这个',
      'Vota':'提交',
      'Annulla voto':'取消',
      'ERROR':'请输入有效的评分(1-10)',
      '-ELIMINA PREFERITO':'从收藏中删除',
      '+AGGIUNGI PREFERITI':'+收藏',
      'il tuo voto':'你的评分'
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'it',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;


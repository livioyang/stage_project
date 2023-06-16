import { GiFilmProjector } from 'react-icons/gi';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function FilmBtn({changetypeFilm}){
    const { t } = useTranslation();
    return(
        <button onClick={changetypeFilm}>{t('Film')}<GiFilmProjector /></button>
    )
}
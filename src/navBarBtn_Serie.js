import { BiSlideshow } from 'react-icons/bi';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function SerieBtn({changeTypeSerie}){
    const { t } = useTranslation();
    return(
        <button onClick={changeTypeSerie}>{t('Serie')}<BiSlideshow /></button>
    )
}
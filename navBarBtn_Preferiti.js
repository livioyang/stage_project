import { BiHeart } from 'react-icons/bi';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function PreferitoBtn({changePreferito}){
    const { t } = useTranslation();
    return(
        <button onClick={changePreferito}>{t('Preferiti')}<BiHeart /></button>
    )
}

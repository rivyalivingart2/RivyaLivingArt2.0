'use client';
import {createContext,useContext,useCallback,type ReactNode} from 'react';
import {journeyText} from '@/lib/journey-text';
import type {Locale} from '@/lib/site-settings-model';
import s from './shop.module.css';
const Language=createContext<Locale>('en');
export function JourneyLanguage({locale,children}:{locale:Locale;children:ReactNode}){return <Language.Provider value={locale}>{children}</Language.Provider>;}
export function useJourneyText(){const locale=useContext(Language);return useCallback((text:string)=>journeyText(locale,text),[locale]);}
export function JourneyText({text}:{text:string}){const locale=useContext(Language),value=journeyText(locale,text);return <span lang={value===text?'en':locale}>{value}</span>;}
export function LanguageNotice(){const locale=useContext(Language);if(locale==='en')return null;return <aside className={s.languageNotice} aria-label={journeyText(locale,'Language guidance')}><p>{journeyText(locale,'Interface text is available in your selected language. Editorial text without a current review, product details and saved messages remain in English.')}</p></aside>;}

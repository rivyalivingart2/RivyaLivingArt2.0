'use client';
import {ContentEditor} from './content-editor';

export function SiteImagesEditor({admin}:{admin:boolean}){
 return <ContentEditor admin={admin} initialKind="page" initialRecord="page:home" initialHomeSection="material"/>;
}

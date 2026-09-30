'use client';
import {ContentEditor} from './content-editor';

export function SiteCopyEditor({admin}:{admin:boolean}){
 return <ContentEditor admin={admin} initialKind="page"/>;
}

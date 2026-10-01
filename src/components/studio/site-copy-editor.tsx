'use client';
import {ContentEditor} from './content-editor';
import {sharedCopyId} from '@/lib/shared-copy-model';
export function SiteCopyEditor({admin}:{admin:boolean}){return <ContentEditor admin={admin} initialKind="page" initialRecord={sharedCopyId}/>;}

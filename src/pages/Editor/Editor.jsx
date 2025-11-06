import CheckList from '@editorjs/checklist'
import Code from '@editorjs/code'
import Delimiter from '@editorjs/delimiter'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import { default as ImageTool } from '@editorjs/image'
import InlineCode from '@editorjs/inline-code'
import LinkTool from '@editorjs/link'
import List from '@editorjs/list'
import Marker from '@editorjs/marker'
import Quote from '@editorjs/quote'
import Raw from '@editorjs/raw'
import SimpleImage from '@editorjs/simple-image'
import Table from '@editorjs/table'
import Warning from '@editorjs/warning'
import React from 'react'
import EditorJs from 'react-editor-js'
import { http } from '../../lib/axios'

const EDITOR_JS_TOOLS = {
  embed: Embed,
  table: Table,
  marker: Marker,
  list: List,
  warning: Warning,
  code: Code,
  linkTool: LinkTool,
  raw: Raw,
  header: Header,
  quote: Quote,
  checklist: CheckList,
  delimiter: Delimiter,
  inlineCode: InlineCode,
  simpleImage: SimpleImage,
  image: {
    class: ImageTool,
    config: {
      uploader: {
        async uploadByFile(file) {
          const formData = new FormData()
          formData.append('file', file)
          const response = await http({
            method: 'post',
            cache: false,
            contentType: false,
            processData: false,
            url: process.env.REACT_APP_BACKEND_URL + '/file/upload',
            data: formData,
            headers: {
              teezarat: localStorage.getItem('token'),
            },
          })
          return {
            success: '1',
            file: {
              url: process.env.REACT_APP_BACKEND_URL + response.data.url,
            },
          }
        },
      },
    },
  },
}

export default function Editor({ onChange, defaultValue, readOnly }) {
  return (
    <div className='  '>
      <EditorJs
        key={defaultValue}
        tools={EDITOR_JS_TOOLS}
        onChange={onChange}
        readOnly={readOnly}
        data={JSON.parse(defaultValue || JSON.stringify({}))}
      />
    </div>
  )
}

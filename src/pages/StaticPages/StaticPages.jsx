import React, { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { CREATE_STATIC, GET_STATIC } from '../../lib/admin'
import { Button } from 'react-bootstrap'
import Editor from '../Editor/Editor'

const tabs = {
  0: 'about_us',
  1: 'faq',
  2: 'terms',
  3: 'policy',
}

const StaticPages = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const { data: staticData, refetch } = useQuery(['GET_STATIC'], GET_STATIC)
  const [staticStr, setStaticStr] = React.useState('')
  const { mutateAsync: createStaticMutation } = useMutation(CREATE_STATIC)

  const getDefaultValue = useMemo(() => {
    switch (currentTab) {
      case 0:
        return staticData?.data?.data?.about_us
      case 1:
        return staticData?.data?.data?.faq
      case 2:
        return staticData?.data?.data?.terms
      case 3:
        return staticData?.data?.data?.policy
      default:
        break
    }
  }, [currentTab, staticData])

  const getPropertyName = useCallback(() => {
    switch (currentTab) {
      case 0:
        return 'about_us'
      case 1:
        return 'faq'
      case 2:
        return 'terms'
      case 3:
        return 'policy'
      default:
        break
    }
  }, [currentTab])

  const handleSaveStatic = useCallback(async () => {
    try {
      await createStaticMutation({
        [getPropertyName()]: staticStr,
      })
      await refetch()
      toast.success('Successfully updated static data!')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.msg || err?.message)
    }
  }, [createStaticMutation, getPropertyName, refetch, staticStr])

  return (
    <div className='my-3'>
      <div
        style={{
          maxWidth: '1440px',
          margin: 'auto',
          width: '95%',
        }}
      >
        <h3 style={{ fontWeight: 'bold' }}>Static Pages</h3>
        <div className='mb-5'>
          <Button
            className={currentTab === 0 ? 'btn-primary mr-2' : 'btn-outline-primary mr-2'}
            onClick={() => setCurrentTab(0)}
          >
            About us
          </Button>
          <Button
            className={currentTab === 1 ? 'btn-primary mr-2' : 'btn-outline-primary mr-2'}
            onClick={() => setCurrentTab(1)}
          >
            FAQs
          </Button>
          <Button
            className={currentTab === 2 ? 'btn-primary mr-2' : 'btn-outline-primary mr-2'}
            onClick={() => setCurrentTab(2)}
          >
            Terms
          </Button>
          <Button
            className={currentTab === 3 ? 'btn-primary mr-2' : 'btn-outline-primary mr-2'}
            onClick={() => setCurrentTab(3)}
          >
            Policy
          </Button>
        </div>
      </div>

      <div className='my-3 editorWrapper'>
        <Editor
          key={`Editor_${currentTab}`}
          defaultValue={getDefaultValue}
          onChange={(_, data) => setStaticStr(JSON.stringify(data))}
        />
      </div>
      <div style={{ margin: 'auto', maxWidth: '1440px', width: '95%' }}>
        <Button className='my-3' onClick={() => handleSaveStatic()}>
          Save
        </Button>
      </div>
    </div>
  )
}

export default StaticPages

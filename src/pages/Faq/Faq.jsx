import React, { useCallback, useMemo, useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { CREATE_STATIC, GET_STATIC } from '../../lib/admin'
import { Button } from 'react-bootstrap'
import Editor from '../Editor/Editor'

const Faq = () => {
  const [staticStr, setStaticStr] = React.useState('')
  const [currentTab, setCurrentTab] = useState(0)

  const { data: staticData, refetch } = useQuery(['GET_STATIC'], GET_STATIC)

  const { mutateAsync: createStaticMutation } = useMutation(CREATE_STATIC)

  const getDefaultValue = useMemo(() => {
    switch (currentTab) {
      case 0:
        return staticData?.data?.data?.faq
      default:
        break
    }
  }, [currentTab, staticData])

  const getPropertyName = useCallback(() => {
    switch (currentTab) {
      case 0:
        return 'faq'

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
    <div className='my-3 editorWrapper'>
      <Editor
        key={`Editor_${currentTab}`}
        defaultValue={getDefaultValue}
        onChange={(_, data) => setStaticStr(JSON.stringify(data))}
      />
      {
        <Button className='m-3' onClick={() => handleSaveStatic()}>
          Save
        </Button>
      }
    </div>
  )
}

export default Faq

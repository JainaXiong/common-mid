import React, { memo } from "react"
import { InboxOutlined } from "@ant-design/icons"
import { Upload } from "antd"

/**
 * @name  上传文件等
 * @param  {Object} 配置项
 * @example
 * <MidUploadFile {...props} />
 */
export const MidUploadFile = memo((props: any) => {
  const {
    LANG,
    message,
    className,
    typeName,
    value,
    limits,
    uploadUrl,
    headers,
    onChange,
    formData = false,
    tip = null
  } = props

  const beforeUpload = (file: any) => {
    return new Promise((resolve) => {
      const { maxSize, fileType } = limits
      if (fileType) {
        let pass = false
        for (let i = 0, len = fileType.length; i < len; i++) {
          if (file.type.indexOf(fileType[i]) > 0) {
            pass = true
            break
          }
        }
        if (!pass) {
          message(LANG.IMG_TIP_TYPE)
          return Upload.LIST_IGNORE
        }
      }
      if (file.size > maxSize * 1024 * 1024) {
        message(LANG.IMG_TIP_SIZE(typeName, maxSize))
        return Upload.LIST_IGNORE
      }
      if (formData) {
        onChange({ file, name: file.name })
        return Upload.LIST_IGNORE
      }
      resolve(true)
    })
  }

  const handleChange = (info: any) => {
    const { file } = info
    const { status, response } = file
    if (status === "done") {
      let { code, msg, data } = response
      if (code === "8001") {
        onChange({ path: data?.path || data, name: file.name })
      } else {
        message(msg)
      }
    }
  }
  return (
    <div className={className}>
      <Upload.Dragger
        name="file"
        action={uploadUrl}
        headers={headers}
        maxCount={1}
        // @ts-ignore
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onRemove={() => onChange(null)}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{LANG.UPLOAD_FILE}</p>
        {value && (
          <p className="ant-upload-hint">
            {LANG.UPLOAD_FILE_TIP + (value?.name || value)}
          </p>
        )}
      </Upload.Dragger>
      {tip}
    </div>
  )
})

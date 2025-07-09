/*
 * @Author: Jaina Xiong
 * @Email: 17761608@qq.com
 * @Date: 2025-07-09 12:42:34
 * @LastEditors: Jaina Xiong
 * @LastEditTime: 2025-07-09 14:38:40
 */
//@ts-nocheck
import React, { memo } from 'react'
import { Breadcrumb } from 'antd'
import { LooseObject } from 'common-screw'

interface Props {
  className?: string // class名称
  componentProps: { Link: any; IconFont?: any } // 组件
  breadProps: LooseObject // 面包屑属性
  baseProps: {
    isShowIcon: boolean
    homeName: string
    homeUrl: string
    homeIcon: string
  } // 基础属性
  specialList: {
    noJumpList?: LooseObject
    jumpList?: LooseObject
    noShowList?: string[]
  } // 需特殊处理URL信息
  pathname: string // 当前URL
  pathInfo: LooseObject // URL对应信息(name,icon)
  pathShowList: string[] // 可展示的URL
}

/**
 * @name  面包屑导航
 * @param  {Props} 配置项
 * @example
 * <MidBreadcrumb
    className={styles.antdBread}
    componentProps={componentProps}
    breadProps={breadProps}
    baseProps={baseProps}
    specialList={specialList}
    pathname={pathname}
    pathInfo={breadcrumbList}
    pathShowList={ablePathList}
  />
 */
export const MidBreadcrumb = memo((props: Props) => {
  const {
    className,
    componentProps: { Link, IconFont },
    breadProps,
    baseProps: { isShowIcon, homeName, homeUrl, homeIcon },
    specialList: { noJumpList = {}, jumpList = {}, noShowList = [] },
    pathname,
    pathInfo,
    pathShowList
  } = props
  const pathSnippets: string[] = pathname?.split('/').filter((i: string) => i)

  const extraBreadcrumbItems = pathSnippets.map((_: string, index: number) => {
    if (noJumpList[_]) {
      return <Breadcrumb.Item key={index}>{noJumpList[_]}</Breadcrumb.Item>
    }
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    let toUrl = url
    if (Object.keys(jumpList).includes(_)) {
      toUrl = jumpList[_]
    }
    if (!pathInfo[url]?.name || noShowList.includes(_)) {
      // 无路径名称或 不显示路径
      return ''
    }
    const content = (
      <>
        {isShowIcon && IconFont && pathInfo[url]?.icon && <IconFont type={`icon-${pathInfo[url]?.icon}1`} />}

        {pathInfo[url]?.name}
      </>
    )
    return <Breadcrumb.Item key={url}>{toUrl ? <Link to={toUrl}>{content}</Link> : content}</Breadcrumb.Item>
  })

  return (
    <Breadcrumb {...breadProps} className={className}>
      {pathShowList.includes(homeUrl) && (
        <Breadcrumb.Item href={homeUrl}>
          {isShowIcon && IconFont && <IconFont type={homeIcon} />}
          {homeName}
        </Breadcrumb.Item>
      )}
      {pathShowList.includes(pathname) && extraBreadcrumbItems}
    </Breadcrumb>
  )
})

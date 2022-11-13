import { Result } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

export const NotAuthorisedPage = () => {
    return (
        <div>
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Link to = '/' className='btn btn-dark'>Back Home</Link>}
            />
        </div>
    )
}

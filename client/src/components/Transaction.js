import React from 'react'

const Transaction = ({ transaction }) => {

    const { inputMap, outputMap } = transaction;
    const recipients = Object.keys(outputMap);

    return (
        <div className='Transaction'>
            <div>From: {`${inputMap.address.substring(0, 20)}...`} | Balance: {inputMap.amount}</div>
            {
                recipients.map(recipient => (
                    <div key={recipient}>
                        To: {`${recipient.substring(0, 20)}...`} | Sent: {outputMap[recipient]}
                    </div>
                ))
            }
        </div>
    )
}

export default Transaction

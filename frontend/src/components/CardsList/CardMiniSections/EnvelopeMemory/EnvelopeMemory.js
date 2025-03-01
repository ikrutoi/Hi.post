import './EnvelopeMemory.scss'
import {
  getMyAddress,
  deleteMyAddress,
  getAllMyAddress,
  getToAddress,
  deleteToAddress,
  getAllToAddress,
} from '../../../../utils/cardFormNav/indexDB/indexDb'
import { useState } from 'react'

const EnvelopeMemory = ({ sizeMiniCard, section }) => {
  const getAddress = async (section) => {
    if (section === 'myaddress') {
      try {
        const allMyAddress = await getAllMyAddress('myAddress')
        console.log('allMyAddress', allMyAddress)
      } catch (error) {
        console.error('Error fetching my address:', error)
      }
    }
    if (section === 'toaddress') {
      try {
        const allToAddress = await getAllToAddress('toAddress')
        console.log('allToAddress', allToAddress)
      } catch (error) {
        console.error('Error fetching to address:', error)
      }
    }
  }

  getAddress(section)

  return (
    <div className="envelope-history">
      <div
        className="envelope-history-card"
        style={{
          // padding: sectionInfo.section === 'cardphoto' ? '0' : '0.5rem',
          width: `${sizeMiniCard.width}px`,
          height: `${sizeMiniCard.height}px`,
        }}
      >
        {section}
      </div>
    </div>
  )
}

export default EnvelopeMemory

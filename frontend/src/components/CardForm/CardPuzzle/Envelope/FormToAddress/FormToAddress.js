import labelsList from '../../../../../data/envelope/list-labels-to-address.json'
import Label from '../Label/Label'
import './FormToAddress.scss'

const FormToAddress = ({
  valueToAddress,
  handleValueAddress,
  handleKeyArrow,
  setRef,
}) => {
  return (
    <form className="envelope-form form-to-address">
      <fieldset className="envelope-fieldset">
        <legend className="envelope-legend">To address</legend>
        {labelsList.map((nameFirst, i) => {
          return typeof nameFirst === 'string' ? (
            <Label
              key={`${nameFirst.split('-')[1]}-${i}`}
              name={nameFirst}
              valueToAddress={valueToAddress}
              handleValueAddress={handleValueAddress}
              handleKeyArrow={handleKeyArrow}
              setRef={setRef}
            />
          ) : (
            <div className="input-two-elements">
              {nameFirst.map((nameSecond, i) => (
                <Label
                  key={`${nameSecond.split('-')[1]}-${
                    nameSecond.split('-')[0]
                  }`}
                  name={nameSecond}
                  valueToAddress={valueToAddress}
                  handleValueAddress={handleValueAddress}
                  handleKeyArrow={handleKeyArrow}
                  setRef={setRef}
                />
              ))}
            </div>
          )
        })}
      </fieldset>
    </form>
  )
}

export default FormToAddress

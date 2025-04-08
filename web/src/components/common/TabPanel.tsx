type Props = {
  children?: React.ReactNode
  value: number
  index: number
  [key: string]: unknown
}

export default function TabPanel({ children, value, index, ...other }: Props) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div>{children}</div>
      )}
    </div>
  )
}
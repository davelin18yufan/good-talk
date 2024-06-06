import SectionTitle from "./SectionTitle"

const TradeSummary = () => {
  
  return (
    <div className="p-4 bg-white rounded-md shadow-md relative">
      <SectionTitle title="我的庫存" />
      <p className="text-2xl text-red-500 mb-4">未實現損益: 46,300.00</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">股票名</h3>
          {/* 庫存列表 */}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">損益</h3>
          {/* 損益列表 */}
        </div>
      </div>
    </div>
  )
}

export default TradeSummary

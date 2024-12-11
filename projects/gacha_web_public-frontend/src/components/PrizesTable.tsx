import abilityIcon from '../assets/ability-icon.webp'

export default function PrizesTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border-spacing-0">
        <thead>
          <tr>
            <th className="border-b-4 border-gray-500 bg-[#7D6B59] px-2 py-1 text-xs text-white md:px-4 md:py-2 md:text-base">Rarity</th>
            <th className="border-b-4 border-gray-500 bg-[#7D6B59] px-2 py-1 text-xs text-white md:px-4 md:py-2 md:text-base">Element</th>
            <th className="border-b-4 border-gray-500 bg-[#7D6B59] px-2 py-1 text-xs text-white md:px-4 md:py-2 md:text-base">Type</th>
            <th className="border-b-4 border-gray-500 bg-[#7D6B59] px-2 py-1 text-xs text-white md:px-4 md:py-2 md:text-base">Name</th>
            <th className="border-b-4 border-gray-500 bg-[#7D6B59] px-2 py-1 text-xs text-white md:px-4 md:py-2 md:text-base">Draw Rate</th>
          </tr>
        </thead>
        <tbody>
          <tr className="odd:bg-white even:bg-gray-100">
            <td className="border-b border-gray-300 px-2 py-1 text-xs text-orange-500 md:px-4 md:py-2 md:text-base">Legendary</td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2">
              <img src={abilityIcon} alt="element" className="inline-block h-6 w-6" />
            </td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-100">
            <td className="border-b border-gray-300 px-2 py-1 text-xs text-green-500 md:px-4 md:py-2 md:text-base">Common</td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2">
              <img src={abilityIcon} alt="element" className="inline-block h-6 w-6" />
            </td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-100">
            <td className="border-b border-gray-300 px-2 py-1 text-xs text-blue-500 md:px-4 md:py-2 md:text-base">Rare</td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
          </tr>
          <tr className="odd:bg-white even:bg-gray-100">
            <td className="border-b border-gray-300 px-2 py-1 text-xs text-purple-500 md:px-4 md:py-2 md:text-base">Epic</td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
            <td className="border-b border-gray-300 px-2 py-1 md:px-4 md:py-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

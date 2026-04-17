import { useLDFlags } from '../hooks/useLDFlags'

export default function FlagsDebug() {
  const flags = useLDFlags()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-2">LaunchDarkly Flag Values</h1>
      <p className="text-sm text-gray-500 mb-6">Current flag state for this user context.</p>
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-700">Flag Key</th>
              <th className="text-left px-5 py-3 font-medium text-gray-700">Value</th>
              <th className="text-left px-5 py-3 font-medium text-gray-700">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Object.entries(flags).map(([key, value]) => (
              <tr key={key} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-mono text-gray-800">{key}</td>
                <td className="px-5 py-3">
                  {typeof value === 'boolean' ? (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {String(value)}
                    </span>
                  ) : (
                    <span className="font-mono text-[#1B2A4A]">{String(value)}</span>
                  )}
                </td>
                <td className="px-5 py-3 text-gray-400">{typeof value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

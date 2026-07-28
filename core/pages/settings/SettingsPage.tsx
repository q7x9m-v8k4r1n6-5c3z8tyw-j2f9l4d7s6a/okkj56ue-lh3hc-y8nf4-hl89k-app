import { SecurityRoleManagement } from '@/core/features/settings/manage-roles'
import { Tabs } from '@/core/shared'
import { useSettingsPage } from './model/useSettingsPage'

/**
 * Composes settings sections while each feature owns its server and workflow state.
 */
export const SettingsPage = () => {
  const page = useSettingsPage()

  return (
    <main className="flex h-[calc(100svh-61px)] min-h-0 flex-col bg-white">
      <div className="shrink-0 px-6 pt-5">
        <Tabs items={page.tabs} value={page.activeTab} onChange={page.onTabChange} />
      </div>
      {page.activeTab === 'security' ? <SecurityRoleManagement /> : null}
    </main>
  )
}


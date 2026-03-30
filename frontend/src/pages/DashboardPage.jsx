import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Rocket, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ProjectList } from '@/components/projects/ProjectList'
import { NewProjectModal } from '@/components/projects/NewProjectModal'
import { DeploymentHistory } from '@/components/projects/DeploymentHistory'
import { useAuth } from '@/hooks/useAuth'
import { useProject } from '@/hooks/useProject'

const TEMPLATE_CODE = {
  'Hello World': `#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        vec![&env, symbol_short!("Hello"), to]
    }
}`,
  'Token': `#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env, String};

#[contract]
pub struct TokenContract;

#[contractimpl]
impl TokenContract {
    pub fn initialize(env: Env, admin: Address, name: String, symbol: String) {
        admin.require_auth();
    }
}`,
  default: `#![no_std]
use soroban_sdk::{contract, contractimpl, Env};

#[contract]
pub struct MyContract;

#[contractimpl]
impl MyContract {
    // Add your contract functions here
}`,
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { projects, fetchProjects, create, remove } = useProject()
  const [newProjectOpen, setNewProjectOpen] = useState(false)

  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = (project) => {
    navigate(`/ide/${project.id}`)
  }

  const handleCreate = async (data) => {
    const source_code = TEMPLATE_CODE[data.template] || TEMPLATE_CODE.default
    const project = await create({
      name: data.name,
      description: data.description || null,
      source_code,
      language: 'rust',
      is_public: false,
    })
    if (project) navigate(`/ide/${project.id}`)
  }

  return (
    <div className="min-h-screen bg-bg-primary font-sans overflow-auto">
      <header className="bg-bg-secondary border-b border-bg-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket size={20} className="text-accent-blue" />
            <span className="font-bold text-text-primary">StellarIDE</span>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-2">
                {user.avatar_url && (
                  <img src={user.avatar_url} alt={user.username} className="w-7 h-7 rounded-full border border-bg-border" />
                )}
                <span className="text-sm text-text-secondary">{user.username || user.email}</span>
              </div>
            )}
            <Button variant="ghost" size="sm" icon={LogOut} onClick={logout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
            <p className="text-text-muted text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setNewProjectOpen(true)}>
            New Project
          </Button>
        </div>

        <ProjectList
          projects={projects}
          onOpen={handleOpen}
          onDelete={remove}
          onNew={() => setNewProjectOpen(true)}
        />

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Deployments</h2>
          <div className="bg-bg-secondary border border-bg-border rounded-lg overflow-hidden">
            <DeploymentHistory deployments={[]} />
          </div>
        </div>
      </main>

      <NewProjectModal
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}
export default function ModuleCard({ module, isSelected, onSelect }) {
  return (
    <div
      className={`module-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect()
        }
      }}
      style={{
        '--card-color': module.color
      }}
    >
      <div className="card-icon">
        {module.icon}
      </div>
      <h3>{module.title}</h3>
      <p>{module.description}</p>
      <div className="card-footer">
        <span className="status">To Do</span>
      </div>
    </div>
  )
}

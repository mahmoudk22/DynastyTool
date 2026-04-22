export default function LeagueMembers({ users }: any) {
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h2 className="text-xl font-bold mb-3">League Members</h2>

      {users.map((user: any) => (
        <div key={user.user_id}>{user.display_name}</div>
      ))}
    </div>
  )
}
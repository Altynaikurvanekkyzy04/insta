import React, { useMemo, useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { FiHome, FiSearch, FiHeart, FiUser, FiSend, FiPlusSquare, FiSettings, FiChevronLeft } from "react-icons/fi";

const LS_KEY = "insta_like_user";
const getUser = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; } catch { return null; }
};
const setUser = (u) => localStorage.setItem(LS_KEY, JSON.stringify(u));
const clearUser = () => localStorage.removeItem(LS_KEY);


const Shell = ({ children, title, left, right }) => (
  <div className="max-w-[480px] mx-auto min-h-screen font-ui text-ink">

    <div className="h-12 border-b border-neutral-200 flex items-center px-3">
      <div className="w-16">{left}</div>
      <div className="flex-1 text-center font-semibold">{title}</div>
      <div className="w-16 flex justify-end">{right}</div>
    </div>
    <div className="pb-14">{children}</div>
    <BottomNav />
  </div>
);

const BottomNav = () => {
  const Item = ({ to, icon, label }) => (
    <Link to={to} className="flex flex-col items-center justify-center w-full py-2 text-ink">
      <div className="text-[24px] leading-none">{icon}</div>
    </Link>
  );
  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="max-w-[480px] mx-auto border-t border-neutral-200 bg-white grid grid-cols-5">
        <Item to="/home" icon={<FiHome />} />
        <Item to="/search" icon={<FiSearch />} />
        <Item to="/create" icon={<FiPlusSquare />} />
        <Item to="/activity" icon={<FiHeart />} />
        <Item to="/profile" icon={<FiUser />} />
      </div>
    </div>
  );
};

const Avatar = ({ src, size = 44, ring = false }) => (
  <div className={ring ? "story-ring rounded-full" : ""} style={{ width: size + 4, height: size + 4 }}>
    <img src={src} alt="" className="rounded-full object-cover" style={{ width: size, height: size, margin: 2 }} />
  </div>
);


const Login = () => {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  const onLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setUser({
      username: username.trim(),
      avatar: avatar.trim() || "https://i.pravatar.cc/150?img=3",
      bio: "О себе",
    });
    nav("/home", { replace: true });
  };

  return (
    <div className="max-w-[420px] mx-auto mt-16 p-6 border border-neutral-200 rounded-xl">
      <div className="text-center mb-4 text-ink font-semibold text-xl">Insta-like</div>
      <form onSubmit={onLogin} className="grid gap-3">
        <input className="border border-neutral-300 rounded-md px-3 py-2" placeholder="Имя пользователя" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input className="border border-neutral-300 rounded-md px-3 py-2" placeholder="URL аватара (необязательно)" value={avatar} onChange={(e)=>setAvatar(e.target.value)} />
        <button className="bg-black text-white rounded-md py-2">Войти</button>
      </form>
      <p className="text-xs text-ink-soft mt-3">Поддерживается аватар по ссылке (например, Imgur/Cloudinary). Если оставить пустым — поставим заглушку.</p>
    </div>
  );
};

const Private = ({ children }) => getUser() ? children : <Navigate to="/login" replace />;


const Home = () => {
  const nav = useNavigate();
  const user = getUser();
  const feed = [
    { id: 1, user: "ali", avatar: "https://i.pravatar.cc/150?u=ali", img: "https://picsum.photos/seed/ali/800/600", caption: "Доброе утро!" },
    { id: 2, user: "mira", avatar: "https://i.pravatar.cc/150?u=mira", img: "https://picsum.photos/seed/mira/800/600", caption: "Новый день ✨" },
  ];

  const stories = ["mira","john","nina","arzu","bayan","alex","sam"].map(u=>({u,src:`https://i.pravatar.cc/150?u=${u}`}));

  return (
    <Shell
      title="Instagram"
      left={<button onClick={()=>nav("/direct")} title="Direct"><FiSend className="text-[22px]" /></button>}
      right={<Link to="/settings" title="Настройки"><FiSettings className="text-[22px]" /></Link>}
    >

      <div className="flex gap-3 overflow-x-auto px-3 py-2">
        <div className="flex flex-col items-center text-xs">
          <Avatar src={user?.avatar} size={56} />
          <span className="mt-1">Ваша история</span>
        </div>
        {stories.map(s=>(
          <div key={s.u} className="flex flex-col items-center text-xs">
            <Avatar src={s.src} size={56} ring />
            <span className="mt-1">@{s.u}</span>
          </div>
        ))}
      </div>

     
      <div className="grid gap-4">
        {feed.map(p=>(
          <article key={p.id} className="border-b border-neutral-200">
            <div className="flex items-center gap-2 px-3 py-2">
              <Avatar src={p.avatar} size={36} />
              <div className="font-semibold">@{p.user}</div>
            </div>
            <img src={p.img} alt="" className="w-full block" />
            <div className="px-3 py-2">
              <div className="flex gap-4 text-[24px]">
                <button aria-label="like"><FiHeart /></button>
                <button aria-label="send"><FiSend /></button>
              </div>
              <p className="mt-2 text-sm"><span className="font-semibold mr-2">@{p.user}</span>{p.caption}</p>
            </div>
          </article>
        ))}
      </div>
    </Shell>
  );
};

const Search = () => {
  const [q, setQ] = useState("");
  const results = useMemo(()=>{
    const all = Array.from({length:30},(_,i)=>`user_${i+1}`);
    return q ? all.filter(n=>n.includes(q.toLowerCase())) : all.slice(0,12);
  },[q]);
  return (
    <Shell title="Поиск">
      <div className="p-3">
        <input className="w-full border border-neutral-300 rounded-md px-3 py-2" placeholder="Поиск" value={q} onChange={(e)=>setQ(e.target.value)} />
        <div className="grid grid-cols-3 gap-1 mt-3">
          {results.map(r=>(
            <img key={r} src={`https://picsum.photos/seed/${r}/400/400`} alt="" className="w-full aspect-square object-cover" />
          ))}
        </div>
      </div>
    </Shell>
  );
};

const Direct = () => {
  const chats = [
    { id:1, user:"ali", text:"Как дела?", avatar:"https://i.pravatar.cc/150?u=ali" },
    { id:2, user:"mira", text:"Отправила фото", avatar:"https://i.pravatar.cc/150?u=mira" },
  ];
  return (
    <Shell title="Direct">
      <div className="p-3 grid gap-2">
        {chats.map(c=>(
          <div key={c.id} className="flex items-center gap-3 border border-neutral-200 rounded-xl p-2">
            <Avatar src={c.avatar} size={44} />
            <div>
              <div className="font-semibold">@{c.user}</div>
              <div className="text-sm text-ink-soft">{c.text}</div>
            </div>
            <button className="ml-auto text-sm border rounded-md px-2 py-1">Открыть</button>
          </div>
        ))}
      </div>
    </Shell>
  );
};

const Activity = () => {
  const items = [
    { id:1, text:"mira поставила лайк вашей записи", when:"2 мин назад" },
    { id:2, text:"ali подписался на вас", when:"1 ч назад" },
  ];
  return (
    <Shell title="Активность">
      <div className="p-3 grid gap-2">
        {items.map(i=>(
          <div key={i.id} className="flex items-center gap-3 border border-neutral-200 rounded-xl p-2">
            <div className="text-[22px]">❤️</div>
            <div>
              <div>{i.text}</div>
              <div className="text-xs text-ink-soft">{i.when}</div>
            </div>
            
          </div>
        ))}
      </div>
    </Shell>
  );
};

const ModalList = ({ open, title, items, onClose }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-[480px] rounded-t-2xl bg-white p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="text-sm text-blue-600">
            Закрыть
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto divide-y">
          {items.map((u) => (
            <div key={u} className="flex items-center gap-3 py-2">
              <img
                src={`https://i.pravatar.cc/150?u=${u}`}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
              <div className="text-sm">@{u}</div>
              <button className="ml-auto rounded-md border px-2 py-1 text-xs">
                Подписаться
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Highlight = ({ label, empty }) => (
  <div className="w-20 flex-shrink-0">
    <div
      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border ${
        empty ? "border-neutral-300" : "border-transparent"
      } overflow-hidden bg-white`}
    >
      {empty ? (
        <span className="text-2xl text-neutral-400">+</span>
      ) : (
        <img
          src={`https://picsum.photos/seed/${encodeURIComponent(
            label
          )}/120/120`}
          alt=""
          className="h-full w-full object-cover"
        />
      )}
    </div>
    <div className="mt-1 truncate text-center text-xs text-neutral-600">
      {label}
    </div>
  </div>
);


const Profile = () => {
  const user = getUser();
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);


  const posts = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];
  const followers = [
    "mira",
    "ali",
    "bayan",
    "nina",
    "sam",
    "arzu",
    "john",
    "alex",
    "mike",
    "liza",
  ];
  const following = [
    "design_daily",
    "coding_fun",
    "travel_kg",
    "classic_hotel",
    "gtech_osh",
    "coffee_hub",
    "friends1",
    "friends2",
  ];

  if (!user) return null;

  return (
    <Shell
      title={user.username}
      right={
        <Link to="/settings" title="Настройки">
          <FiSettings className="text-[20px]" />
        </Link>
      }
    >
      <div className="p-4">

        <div className="flex items-center gap-6">
          <Avatar src={user.avatar} size={88} />
          <div className="grid flex-1 grid-cols-3 gap-2 text-center">
            <button className="leading-tight">
              <div className="text-base font-semibold">{posts.length}</div>
              <div className="text-xs text-neutral-500">Публикации</div>
            </button>
            <button
              onClick={() => setShowFollowers(true)}
              className="leading-tight"
            >
              <div className="text-base font-semibold">{followers.length}</div>
              <div className="text-xs text-neutral-500">Подписчики</div>
            </button>
            <button
              onClick={() => setShowFollowing(true)}
              className="leading-tight"
            >
              <div className="text-base font-semibold">{following.length}</div>
              <div className="text-xs text-neutral-500">Подписки</div>
            </button>
          </div>
        </div>


        <div className="mt-3">
          <div className="font-semibold">@{user.username}</div>
          <div className="text-sm text-neutral-600">{user.bio}</div>
          <div className="mt-2 flex gap-2">
            <Link
              to="/edit"
              className="inline-block rounded-md border px-3 py-1 text-sm"
            >
              Редактировать профиль
            </Link>
            <button className="rounded-md border px-3 py-1 text-sm">
              Поделиться профилем
            </button>
          </div>
        </div>


        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          <Highlight label="Новое" empty />
          <Highlight label="Актуальное" />
          <Highlight label="Путешествия" />
          <Highlight label="Работа" />
        </div>

      
        <div className="mt-4 grid grid-cols-3 gap-1">
          {posts.map((k) => (
            <img
              key={k}
              src={`https://picsum.photos/seed/${k}/400/400`}
              alt=""
              className="aspect-square w-full object-cover"
            />
          ))}
        </div>
      </div>

  
      <ModalList
        open={showFollowers}
        title="Подписчики"
        items={followers}
        onClose={() => setShowFollowers(false)}
      />
      <ModalList
        open={showFollowing}
        title="Подписки"
        items={following}
        onClose={() => setShowFollowing(false)}
      />
    </Shell>
  );
};

const EditProfile = () => {
  const u = getUser();
  const nav = useNavigate();
  const [username, setUsername] = useState(u?.username || "");
  const [avatar, setAvatar] = useState(u?.avatar || "");
  const [bio, setBio] = useState(u?.bio || "");

  const onSave = () => {
    if (!username.trim()) return;
    setUser({ username: username.trim(), avatar: avatar.trim() || "https://i.pravatar.cc/150?img=3", bio: bio.trim() });
    nav("/profile");
  };

  return (
    <Shell title="Редактировать профиль" left={<button onClick={()=>nav(-1)}><FiChevronLeft className="text-[22px]" /></button>}>
      <div className="p-4 grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm text-ink-soft">Имя пользователя</span>
          <input className="border border-neutral-300 rounded-md px-3 py-2" value={username} onChange={(e)=>setUsername(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-ink-soft">URL аватара</span>
          <input className="border border-neutral-300 rounded-md px-3 py-2" value={avatar} onChange={(e)=>setAvatar(e.target.value)} placeholder="https://..." />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-ink-soft">Био</span>
          <textarea rows={3} className="border border-neutral-300 rounded-md px-3 py-2" value={bio} onChange={(e)=>setBio(e.target.value)} />
        </label>
        <div className="flex gap-2">
          <button onClick={onSave} className="bg-black text-white rounded-md px-4 py-2">Сохранить</button>
          <button onClick={()=>nav("/profile")} className="border rounded-md px-4 py-2">Отмена</button>
        </div>
      </div>
    </Shell>
  );
};

const Settings = () => {
  const nav = useNavigate();
  const u = getUser();
  const logout = () => { clearUser(); nav("/login", { replace: true }); };
  return (
    <Shell title="Настройки" left={<button onClick={()=>nav(-1)}><FiChevronLeft className="text-[22px]" /></button>}>
      <div className="p-4 grid gap-3">
        <div className="flex items-center gap-3 border border-neutral-200 rounded-xl p-3">
          <Avatar src={u?.avatar} size={44} />
          <div>
            <div className="font-semibold">@{u?.username}</div>
            <div className="text-xs text-ink-soft">{u?.bio}</div>
          </div>
          <Link to="/edit" className="ml-auto border rounded-md px-3 py-1 text-sm">Изменить</Link>
        </div>
        <button className="border rounded-xl p-3 text-left">🔔 Уведомления (демо)</button>
        <button className="border rounded-xl p-3 text-left">🔒 Конфиденциальность (демо)</button>
        <button className="border rounded-xl p-3 text-left">👤 Аккаунт (демо)</button>
        <button onClick={logout} className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-left">Выйти</button>
      </div>
    </Shell>
  );
};

const Create = () => (
  <Shell title="Создать">
    <div className="p-4 text-sm text-ink-soft">Экран создания поста. Можно добавить загрузку по URL и предпросмотр.</div>
  </Shell>
);


export default function App() {
  const isAuthed = !!localStorage.getItem("insta_demo_user");

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthed?"/home":"/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Private><Home /></Private>} />
      <Route path="/search" element={<Private><Search /></Private>} />
      <Route path="/direct" element={<Private><Direct /></Private>} />
      <Route path="/activity" element={<Private><Activity /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      <Route path="/edit" element={<Private><EditProfile /></Private>} />
      <Route path="/settings" element={<Private><Settings /></Private>} />
      <Route path="/create" element={<Private><Create /></Private>} />
      <Route path="*" element={<Navigate to={isAuthed?"/home":"/login"} replace />} />
    </Routes>
  );


function Private({ children }) {
  return localStorage.getItem("insta_demo_user") ? children : <Navigate to="/login" replace />;
}
}
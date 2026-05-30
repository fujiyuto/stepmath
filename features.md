# 機能一覧

- 機能名：ユーザー登録  
  メソッド：POST  
  パス：/users

- 機能名：ユーザー詳細取得  
  メソッド：GET  
  パス：/users/me

- 機能名：ユーザー編集  
  メソッド：PATCH  
  パス：/users/me  

- 機能名：ユーザー削除  
  メソッド：DELETE  
  パス：/users/me

- 機能名：会話一覧取得
  メソッド：GET
  パス：/conversations

- 機能名：会話詳細取得
  メソッド：GET
  パス：/conversations/{id}

- 機能名：会話作成  
  メソッド：POST  
  パス：/conversations  

- 機能名：チャット送信  
  メソッド：POST
  パス：/conversations/{conversation_id}/messages  

- 機能名：大学情報取得
  メソッド：GET
  パス：/universities

- 機能名：ユーザーの問題情報取得
  メソッド：GET
  パス：/problems/me
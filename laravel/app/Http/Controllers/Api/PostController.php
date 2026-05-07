<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(){
        $post = Post::with('user:id,name')->latest()->paginate(10);

        return response()->json($post);
    }

    public function store(Request $request){
        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string'
        ]);

        $post = $request->user()->posts()->create([
            'title' => $request->title,
            'body' => $request->body,
        ]);

        return response()->json($post, 201);
    }

    public function show(string $id){
        $post = Post::with('user:id,name')->find($id);

        if(!$post){
            return response()->json(['message' => 'post tidak ditemukan'], 404);
        }

        return response()->json($post);
    }

    public function update(Request $request ,string $id){
        $post = Post::find($id);

        if(!$post){
            return response()->json(['message' => 'Post tidak ditemukan'], 404);
        }

        if($post->user_id !== $request->user()->id){
            return response()->json(['message' => 'Anda tidak memiliki akses (forbidden)'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string'
        ]);

        $post->update([
            'title' => $request->title,
            'body' => $request->body,
        ]);

        return response()->json($post);
    }

    public function destroy(Request $request, string $id){
        $post = Post::find($id);

        if(!$post){
            return response()->json(['message' => 'Post tidak ditemukan'], 404);
        }

        if($post->user_id !== $request->user()->id){
            return response()->json(['message' => 'Anda tidak memiliki akses(Forbidden)'], 403);
        }

        $post->delete();

        return response()->json(['message' => 'Delete post berhasil']);
    }
}
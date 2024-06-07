<?php

use App\Models\Todo;
use Illuminate\Support\Facades\Auth;
use Livewire\Volt\Component;

new class extends Component {

    public Todo $todo;
    public string $todoName = '';

    public function createTodo()
    {
        $this->validate([
            'todoName' => 'required|min:3'
        ]);

        Auth::user()->todos()->create([
            'name' => $this->pull('todoName')
        ]);
    }

    public function deleteTodo(int $id)
    {
        $todo = Auth::user()->todos()->find($id);
        $this->authorize('delete', $todo);
        $todo->delete();
    }
    
    public function with()
    {
        return [
            'todos' => Auth::user()->todos()->get()
        ];
    }

}; ?>

<div>
    <form wire:submit='createTodo'>
        <x-text-input wire:model='todoName' />
        <x-primary-button type='submit'>Create</x-primary-button>
        <x-input-error :messages='$errors->get("todoName")' />
    </form>
    @foreach($todos as $todo)
        <div class="flex items-center space-x-4 space-y-2">
            <div wire:key='{{ $todo->id }}'>
                {{ $todo->name }}
            </div>
            <button wire:click='deleteTodo({{ $todo->id }})' class="px-2 py-2 text-white bg-red-500 hover:bg-red-700">Delete</button>
        </div>
    @endforeach
</div>

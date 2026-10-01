from pathlib import Path

from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments


def fine_tune(model_path: str, output_path: str, train_text_path: str):
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(model_path)

    with open(train_text_path, "r", encoding="utf-8") as f:
        data = f.read().splitlines()

    examples = [{"input_ids": tokenizer(line, return_tensors="pt")["input_ids"].squeeze()} for line in data if line.strip()]

    training_args = TrainingArguments(
        output_dir=output_path,
        per_device_train_batch_size=1,
        num_train_epochs=1,
        learning_rate=2e-5,
        logging_steps=10,
        save_steps=200,
        save_total_limit=2,
        fp16=False,
    )

    trainer = Trainer(model=model, args=training_args, train_dataset=examples)
    trainer.train()
    trainer.save_model(output_path)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Fine-tune a local model for AK")
    parser.add_argument("--model-path", required=True, help="Base model path")
    parser.add_argument("--output-path", required=True, help="Directory to write the fine-tuned model")
    parser.add_argument("--train-file", required=True, help="Plain text training file")
    args = parser.parse_args()

    fine_tune(args.model_path, args.output_path, args.train_file)
